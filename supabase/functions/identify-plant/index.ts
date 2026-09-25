import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an expert botanist and plant identification AI assistant. Your task is to analyze leaf images and identify the plant species.

When analyzing a leaf image, you MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "commonName": "string - common name of the plant",
  "scientificName": "string - scientific binomial name",
  "confidence": number between 0-100,
  "description": "string - 2-3 sentences about the plant",
  "uses": {
    "medicinal": ["array of 3 medicinal uses with brief descriptions"],
    "agricultural": ["array of 3 agricultural/commercial uses"],
    "daily": ["array of 3 everyday uses"]
  },
  "habitat": {
    "climate": "string - ideal temperature and climate conditions",
    "soil": "string - soil type requirements",
    "region": "string - native regions",
    "water": "string - watering needs"
  },
  "safety": {
    "toxicity": "string - detailed toxicity information",
    "edible": boolean,
    "petSafe": boolean
  },
  "diseases": ["array of any visible disease symptoms or common issues, empty if none visible"],
  "careInstructions": "string - brief care instructions"
}

Important guidelines:
- Analyze the leaf shape, venation patterns, texture, color, and any distinctive features
- Be accurate with your identification - if unsure, lower the confidence score
- Consider lighting conditions and image quality in your confidence assessment
- Always provide practical, actionable information
- If you cannot identify the plant with reasonable certainty (below 40%), still provide your best guess with a low confidence score`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing plant identification request...');

    // Clean up the image data - ensure proper format
    let cleanImageData = imageData;
    if (imageData.startsWith('data:image')) {
      cleanImageData = imageData;
    } else {
      cleanImageData = `data:image/jpeg;base64,${imageData}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this leaf image and identify the plant. Respond with ONLY valid JSON, no markdown formatting.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: cleanImageData
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please check your account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to analyze image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Raw AI response:', content);

    // Parse the JSON response, handling potential markdown code blocks
    let plantData;
    try {
      // Remove markdown code blocks if present
      let jsonString = content.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7);
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3);
      }
      jsonString = jsonString.trim();
      
      plantData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Content was:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse plant identification results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Plant identified successfully:', plantData.commonName);

    return new Response(
      JSON.stringify({ success: true, data: plantData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in identify-plant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
