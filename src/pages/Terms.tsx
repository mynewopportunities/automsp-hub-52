import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <span className="section-title pl-10 mb-4 inline-block">Legal</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 30, 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">1. Agreement to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using AutoMSP's platform and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Services. These Terms apply to all visitors, users, and others who access or use the Services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">2. Description of Services</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AutoMSP provides an AI-powered automation platform for Managed Service Providers (MSPs) operating on ServiceNow. Our Services include ticket triage automation, intelligent workflows, SLA management, churn prevention analytics, and related features as described on our website and documentation.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">3. Account Registration</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To use certain features of the Services, you must register for an account. When you register, you agree to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">4. Subscription and Billing</h2>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Fees</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree to pay all fees associated with your subscription plan. Fees are billed in advance on a monthly or annual basis depending on your chosen plan. All fees are non-refundable except as expressly stated in these Terms.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Billing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use third-party payment processors to bill you. By providing your payment information, you authorize us to charge your payment method for all fees incurred. You are responsible for providing accurate and current billing information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">5. Acceptable Use</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree not to use the Services to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Transmit harmful code, viruses, or malware</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the Services</li>
                    <li>Use the Services for competitive analysis</li>
                    <li>Resell or redistribute the Services without authorization</li>
                    <li>Use automated means to access the Services without permission</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">6. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The Services and all content, features, and functionality are owned by AutoMSP and are protected by intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Services without prior written consent.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain ownership of any data you submit to the Services. By using our Services, you grant us a limited license to process your data solely for the purpose of providing the Services to you.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">7. Data and Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your use of the Services is also governed by our Privacy Policy. You are responsible for maintaining the confidentiality and security of any data you process through the Services. You represent that you have obtained all necessary consents for the data you submit to our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">8. Service Availability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to provide 99.9% uptime for our Services, but we do not guarantee that the Services will be uninterrupted or error-free. We may suspend or terminate the Services for maintenance, updates, or other reasons. We will provide reasonable notice when possible.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">9. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUTOMSP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">10. Indemnification</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to indemnify, defend, and hold harmless AutoMSP and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Services, your violation of these Terms, or your violation of any rights of a third party.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">11. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Either party may terminate these Terms at any time. Upon termination:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Your access to the Services will be immediately revoked</li>
                    <li>Any outstanding fees become immediately due</li>
                    <li>We will retain your data for 30 days, after which it may be deleted</li>
                    <li>Provisions that by their nature should survive will remain in effect</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">12. Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of the Services after any changes constitutes acceptance of the new Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">13. Governing Law</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of Delaware.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">14. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-semibold">AutoMSP</p>
                    <p className="text-muted-foreground">C1-1003, Burhani Centenary Park</p>
                    <p className="text-muted-foreground">Bhestan, Surat, Gujarat, India 395023</p>
                    <p className="text-muted-foreground">Email: legal@automsp.us</p>
                    <p className="text-muted-foreground">Phone: +1 346 200 3801</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
