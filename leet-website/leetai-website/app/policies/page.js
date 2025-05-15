// app/policies/page.js (using App Router)
// or pages/policies.js (using Pages Router - change export to default)

import Head from 'next/head'; // Still useful for metadata even in App Router via Metadata API, but let's keep it simple for now
import { Metadata } from 'next'; // Preferred way in App Router
import React from 'react';
import {
  LuFileText,     // General Policy
  LuRotateCcw,    // Refund
  LuBadgeX,      // Cancellation
  LuBadgeDollarSign, // Subscription
  LuScrollText,   // Terms of Service
  LuShieldCheck,  // License/Security aspect
  LuUserCog,      // User Conduct
  LuDatabase,     // Content Rights
  LuWrench,       // Service Changes
  LuTriangleAlert
} from 'react-icons/lu';
import Header from '../../components/Header'; // Adjust path if needed
import Footer from '../../components/Footer'; // Adjust path if needed
import Link from 'next/link'; // If needed, e.g., link to settings

// Metadata for App Router (put this outside the component)
export const metadata = {
  title: 'LeetAI Policies | Clear Guidelines for Our Users',
  description: 'Understand LeetAI\'s Refund Policy, Cancellation Policy, Subscription Details, and Terms of Service. Clarity and transparency for our community.',
  // Add other relevant meta tags like open graph, etc.
};


export default function PoliciesPage() {
  console.log("Rendering LeetAI PoliciesPage component...");

  // Placeholder contact info - replace with actual details
  const supportEmail = "support@leetai.dev";
  const supportPhone = "470-919-2464"; // Example number provided
  const subscriptionPrice = "$10-25 USD"; // Example price provided

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 font-sans">
      {/* If not using App Router Metadata API, use Head component */}
      {/* <Head>
        <title>LeetAI Policies | Clear Guidelines for Our Users</title>
        <meta name="description" content="Understand LeetAI's Refund Policy, Cancellation Policy, Subscription Details, and Terms of Service. Clarity and transparency for our community." />
      </Head> */}

      <Header />

      <main className="flex-grow pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center mb-16 lg:mb-24">
             <LuFileText className="w-16 h-16 mx-auto mb-5 text-cyan-500" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-cyan-400">
                Our Policies
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Clear, fair guidelines are essential. Here’s everything you need to know about using LeetAI responsibly and understanding your subscription.
            </p>
          </div>

          {/* Policies Grid/Sections */}
          <div className="max-w-5xl mx-auto space-y-12 lg:space-y-16">

            {/* Refund Policy Section */}
            <section id="refund-policy" className="p-6 md:p-8 border border-gray-700/50 rounded-xl bg-black/30 shadow-lg">
               <div className="flex items-center mb-5">
                  <LuRotateCcw className="w-7 h-7 text-cyan-400 mr-3 flex-shrink-0" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Refund Policy</h2>
              </div>
              <div className="space-y-3 text-gray-300 text-base lg:text-lg leading-relaxed">
                <p>We stand by LeetAI, but understand things can go wrong. We offer a <span className="font-semibold text-cyan-300">24-hour refund policy</span> strictly under the following condition:</p>
                <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                   <li>You must provide clear <span className="font-semibold text-white">video evidence</span> demonstrating that the LeetAI software is definitively not functioning correctly on your specific computer setup.</li>
                </ul>
                <p>Refunds are <span className="font-semibold text-yellow-400">not provided</span> for concerns such as:</p>
                 <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                   <li>Perceived detection risks by monitoring or screen-sharing software (while we strive for undetectability, usage context matters).</li>
                   <li>Subjective assessments of solution generation speed or quality (AI performance can vary).</li>
                </ul>
                <p className="font-semibold mt-4">To request a qualifying refund:</p>
                 <ol className="list-decimal list-inside pl-4 space-y-1 text-gray-400">
                   <li>Contact our support team at <a href={`mailto:${supportEmail}`} className="text-cyan-400 hover:text-cyan-300 underline">{supportEmail}</a> or call us at <span className="text-cyan-400">{supportPhone}</span> within 24 hours of purchase.</li>
                   <li>Include your purchase details, a brief explanation, and the required video evidence showing the malfunction.</li>
                   <li>Approved refunds are typically processed within 5-7 business days.</li>
                 </ol>
              </div>
            </section>

            {/* Cancellation Policy Section */}
            <section id="cancellation-policy" className="p-6 md:p-8 border border-gray-700/50 rounded-xl bg-black/30 shadow-lg">
              <div className="flex items-center mb-5">
                  <LuBadgeX className="w-7 h-7 text-cyan-400 mr-3 flex-shrink-0" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Cancellation Policy</h2>
              </div>
               <div className="space-y-3 text-gray-300 text-base lg:text-lg leading-relaxed">
                 <p>You're in control. You can cancel your LeetAI subscription at any time.</p>
                 <p>Here's how it works:</p>
                 <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                   <li>Your subscription remains fully active until the end of your current paid billing period.</li>
                   <li>You will <span className="font-semibold text-white">not</span> be charged for any future billing cycles after cancellation.</li>
                   <li>Partial refunds for the unused portion of the current billing period are <span className="font-semibold text-yellow-400">not</span> provided.</li>
                   <li>You can continue using all LeetAI features until your current paid period expires.</li>
                 </ul>
                 <p className="mt-4">To cancel, simply navigate to your account settings page within the LeetAI application or website dashboard (link might be needed here if applicable).</p>
                 {/* Optional: Add a direct link if possible */}
                 {/* <Link href="/account/settings" passHref><a className="text-cyan-400 hover:text-cyan-300 underline">Go to Settings</a></Link> */}
              </div>
            </section>

            {/* Subscription Details Section */}
            <section id="subscription-details" className="p-6 md:p-8 border border-gray-700/50 rounded-xl bg-black/30 shadow-lg">
               <div className="flex items-center mb-5">
                  <LuBadgeDollarSign className="w-7 h-7 text-cyan-400 mr-3 flex-shrink-0" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Subscription Details</h2>
              </div>
               <div className="space-y-3 text-gray-300 text-base lg:text-lg leading-relaxed">
                <p>Your LeetAI subscription is billed monthly at <span className="font-semibold text-white">{subscriptionPrice}</span>.</p>
                <p>This subscription grants you:</p>
                <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                  <li>Full access to the LeetAI native application and its features.</li>
                  <li>Regular software updates, including improvements and new capabilities.</li>
                  <li>Access to customer support resources (support levels may vary by plan, specify if needed).</li>
                  <li>Monthly usage credits (details available on pricing page/account).</li>
                </ul>
              </div>
            </section>

            {/* Terms of Service Section */}
            <section id="terms-of-service" className="p-6 md:p-8 border border-gray-700/50 rounded-xl bg-black/30 shadow-lg">
               <div className="flex items-center mb-5">
                  <LuScrollText className="w-7 h-7 text-cyan-400 mr-3 flex-shrink-0" />
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Terms of Service</h2>
              </div>
              <div className="space-y-6 text-gray-300 text-base lg:text-lg leading-relaxed">
                 <p>By accessing and using LeetAI, you agree to be bound by these Terms of Service. Please read them carefully.</p>

                 <div>
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><LuShieldCheck className="w-5 h-5 mr-2 text-green-500"/>License Grant</h3>
                    <p className="text-gray-400">We grant you a limited, non-exclusive, non-transferable, revocable license to install and use the LeetAI software solely for your personal preparation and educational purposes related to coding assessments. <strong className="text-yellow-300">Crucially, this tool is NOT intended or licensed for use during live, proctored, or assessed coding interviews or exams where such assistance is prohibited.</strong> The primary purpose is illustrative – demonstrating capabilities and potentially highlighting flaws in traditional assessment methods.</p>
                 </div>

                 <div>
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><LuUserCog className="w-5 h-5 mr-2 text-purple-400"/>User Conduct</h3>
                    <p className="text-gray-400 mb-2">You agree NOT to:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                       <li>Share your LeetAI account credentials or license key with any third party.</li>
                       <li>Attempt to reverse engineer, decompile, disassemble, or modify the LeetAI software.</li>
                       <li>Use LeetAI for any illegal, unethical, or unauthorized purpose, including violating the academic integrity policies or terms of service of any testing platform or institution.</li>
                       <li>Interfere with, disrupt, or place an unreasonable load on the LeetAI service or its infrastructure.</li>
                       <li>Misrepresent the purpose or capabilities of LeetAI.</li>
                    </ul>
                 </div>

                 <div>
                     <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><LuDatabase className="w-5 h-5 mr-2 text-blue-400"/>Content and Intellectual Property</h3>
                    <p className="text-gray-400">While you may use the output (code, explanations) generated by LeetAI for your learning, LeetAI, including its software, algorithms, branding, user interface, and infrastructure, remains the exclusive intellectual property of its creators. You do not acquire any ownership rights by using the service.</p>
                 </div>

                 <div>
                     <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><LuWrench className="w-5 h-5 mr-2 text-orange-400"/>Service Modifications</h3>
                    <p className="text-gray-400">We continuously work to improve LeetAI. We reserve the right to modify, suspend, or discontinue any part of the service (including features or pricing) with reasonable notice where feasible, although critical updates or changes may occur without prior notice.</p>
                 </div>

                 <div>
                     <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><LuTriangleAlert className="w-5 h-5 mr-2 text-red-500"/>Disclaimer of Warranties & Liability</h3>
                    <p className="text-gray-400">LeetAI is provided "as is" and "as available" without warranties of any kind, either express or implied, including accuracy, reliability, or fitness for a particular purpose. We do not guarantee undetectability or specific outcomes in assessments. Your use of LeetAI is at your own sole risk. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use or inability to use the service, including any consequences resulting from using the tool in prohibited scenarios.</p>
                 </div>

                 <div>
                   <p className="text-gray-400 italic">These Terms may be updated periodically. We will notify users of significant changes where possible. Continued use of LeetAI after changes constitutes acceptance of the revised Terms.</p>
                 </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}