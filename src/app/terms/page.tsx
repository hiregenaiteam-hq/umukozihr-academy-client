import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'UmukoziHR Academy Terms of Service - Guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: December 2024
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using UmukoziHR Academy (academy.umukozihr.com), you agree to be 
              bound by these Terms of Service. If you do not agree to these terms, please do 
              not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              UmukoziHR Academy is an educational platform providing HR leadership, talent 
              management, and professional development content for the African workforce. 
              Our platform allows approved contributors to publish articles and insights 
              on human resources topics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To contribute content to UmukoziHR Academy, you must:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Submit an application to become a contributor</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-600 mb-4">
              We reserve the right to approve or reject contributor applications at our discretion 
              and to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Content Guidelines</h2>
            <p className="text-gray-600 mb-4">
              As a contributor, you agree that your content will:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Be original work or properly attributed</li>
              <li>Not infringe on any intellectual property rights</li>
              <li>Be professional, accurate, and relevant to HR topics</li>
              <li>Not contain defamatory, discriminatory, or illegal content</li>
              <li>Not contain spam, advertising, or promotional material without approval</li>
            </ul>
            <p className="text-gray-600 mb-4">
              We reserve the right to edit, remove, or refuse to publish any content that 
              violates these guidelines or our editorial standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              <strong>Your Content:</strong> You retain ownership of the content you create and 
              publish on UmukoziHR Academy. By publishing content, you grant us a non-exclusive, 
              worldwide, royalty-free license to display, distribute, and promote your content 
              on our platform and related channels.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Our Content:</strong> The UmukoziHR Academy platform, including its design, 
              features, and branding, is owned by UmukoziHR and protected by intellectual property 
              laws. You may not copy, modify, or distribute our platform without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. User Conduct</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the platform</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated systems to access the platform without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              UmukoziHR Academy is provided &quot;as is&quot; and &quot;as available&quot; without any warranties 
              of any kind. We do not guarantee that the platform will be uninterrupted, 
              secure, or error-free. The content on our platform is for informational 
              purposes only and should not be considered professional HR or legal advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, UmukoziHR and its affiliates shall not 
              be liable for any indirect, incidental, special, consequential, or punitive 
              damages arising from your use of the platform or any content published on it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Modifications to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may modify these Terms of Service at any time. We will notify users of 
              significant changes by posting a notice on our platform. Your continued use 
              of the platform after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may suspend or terminate your access to the platform at any time for 
              violations of these terms or for any other reason at our discretion. Upon 
              termination, your right to use the platform will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms of Service shall be governed by and construed in accordance with 
              the laws of Rwanda, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: <a href="mailto:team@umukozihr.com" className="text-[#2563eb] hover:underline">team@umukozihr.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
