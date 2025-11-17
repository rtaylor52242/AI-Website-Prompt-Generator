
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize the GoogleGenAI client directly, assuming API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const businessPlanText = `Forever a Rose Senior Care – Business Plan
Owner: Renee Drummond
Address: 208 White Ash Dr, Clayton, NC 27527
Email: ForeveraRose.FamilyServices@gmail.com
Phone: 919-626-1260
Date: November 13, 2025

1. Executive Summary
Business Overview:
Forever a Rose Senior Care is a luxury in-home and concierge senior care service that provides high-quality, compassionate support to seniors in Clayton and surrounding areas. Services include daily living assistance, medication reminders, bathing, transportation, and companion care. Owner Renee Drummond, a Certified Nursing Assistant, ensures clients receive dignity, comfort, and personalized care.
Mission Statement:
To provide premium, compassionate, and personalized in-home senior care that enhances the quality of life for clients and peace of mind for families.
Vision Statement:
To become the most trusted and sought-after luxury senior care provider in Clayton and the surrounding North Carolina areas.

2. Company Description
Business Structure: Sole Proprietorship transitioning to LLC.
Services Offered:
- Personal care (bathing, dressing, grooming)
- Medication reminders and management
- Transportation to appointments
- Meal preparation
- Companionship and recreational support
- Concierge services (home appointments, errands, personal requests)
Target Market:
- Seniors 65+ living independently or in assisted living facilities
- Families seeking reliable, compassionate care
Competitive Advantage:
- CNA with extensive hands-on experience
- Personalized concierge approach
- Flexible scheduling and high-end service quality

3. Market Analysis
Industry Overview:
Growing senior care industry; families prefer in-home care to keep seniors in familiar environments.

4. Organization & Management
Owner/Operator: Renee Drummond, CNA (daily operations, client care, scheduling, marketing).

5. Marketing & Sales Strategy
Branding:
- Logo and professional brand image
- Website with service details, testimonials, and scheduling
Marketing Channels:
- Local networking and community outreach
- Social media targeting families and senior communities
- Partnerships with healthcare providers and senior living facilities
Sales Strategy:
- Free initial consultations
- Customized care plans
- Referral incentives
`;

const getMetaPrompt = (plan: string): string => `
You are an expert prompt engineer specializing in generating prompts for AI website builders like Google AI Studio. Your task is to create a single, complete, and highly detailed prompt based on the provided business plan. This generated prompt will be used to instruct an AI to build a complete, modern, professional, and fully responsive website.

The final output prompt MUST be a single block of text, ready to be copied and pasted.

Using the business plan below, generate a prompt that includes the following requirements for the website:

1.  **Website Name and Branding:** Use "Forever a Rose Senior Care" as the business name. The brand identity should be luxurious, compassionate, trustworthy, and professional. The color palette should be calming and elegant (e.g., soft blues, gentle grays, warm creams, with rose gold or deep burgundy accents).
2.  **Core Functionality:**
    *   **Fully Responsive Design:** The website must be perfectly optimized for desktops, tablets, and mobile phones.
    *   **Editable Admin Dashboard:** A secure, user-friendly backend where the owner (Renee Drummond) can easily update all website content without needing to code.
    *   **Full Customization:** The admin dashboard must allow for full customization of text, images, themes, colors, fonts, and page layouts.
    *   **Content Management System (CMS):** The ability to create, edit, and manage blog posts and testimonials.
3.  **Website Pages and Placeholder Content:** The prompt should instruct the AI to create the following pages with detailed placeholder content derived from the business plan:
    *   **Home:** A welcoming landing page featuring a high-quality hero image (e.g., a compassionate caregiver with a smiling senior), a clear call-to-action ("Schedule a Free Consultation"), the mission statement, a summary of key services, and a section for testimonials.
    *   **About Us:** A page detailing the story of Renee Drummond (CNA), the company's mission and vision, and the commitment to high-quality, personalized care. Emphasize the competitive advantages like the concierge approach.
    *   **Our Services:** A comprehensive page detailing all services offered (Personal Care, Medication Management, Transportation, Meal Prep, Companionship, Concierge Services). Each service should have its own section with a description and a relevant icon or image.
    *   **Blog:** A blog section to share articles on senior health, wellness tips, and family caregiver resources. Include 2-3 placeholder blog posts with titles like "5 Benefits of In-Home Senior Care" and "Choosing the Right Caregiver for Your Loved One."
    *   **Testimonials:** A page dedicated to showcasing positive reviews from clients and their families. Include 2-3 placeholder testimonials that reflect trust and satisfaction.
    *   **Contact Us:** A page with the business phone (919-626-1260), email (ForeveraRose.FamilyServices@gmail.com), a contact form for inquiries, and a service area map (Clayton, NC and surrounding areas).
4.  **Key Features:**
    *   **SEO Tools:** Built-in tools for managing meta titles, descriptions, and keywords to improve search engine visibility.
    *   **Social Media Integration:** Links to social media profiles and options to share blog content.
    *   **Navigation & Footer:** A clean, intuitive top navigation menu. A professional footer containing contact information, quick links to key pages, and a copyright notice.
    *   **Call-to-Action (CTA):** Prominent CTAs throughout the site, such as "Request a Free Consultation" or "Learn More About Our Services."

Here is the business plan to use as the source of information:
---
${plan}
---
Now, generate the single, complete prompt for Google AI Studio.
`;

export const generateWebsitePrompt = async (businessPlanContent: string): Promise<string> => {
  try {
    const metaPrompt = getMetaPrompt(businessPlanContent);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: metaPrompt,
    });

    const text = response.text;

    if (text) {
      return text;
    } else {
      throw new Error("Received an empty response from the Gemini API.");
    }
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the prompt.");
  }
};
