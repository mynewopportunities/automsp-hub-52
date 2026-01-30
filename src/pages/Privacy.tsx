import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

const Privacy = () => {
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
                Privacy Policy
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
            <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AutoMSP ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">2. Information We Collect</h2>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, or otherwise contact us. This includes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Company name and job title</li>
                    <li>Billing and payment information</li>
                    <li>Account credentials</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">Usage Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We automatically collect certain information when you visit, use, or navigate the platform. This includes device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect or receive for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>To provide, operate, and maintain our platform</li>
                    <li>To improve, personalize, and expand our platform</li>
                    <li>To understand and analyze how you use our platform</li>
                    <li>To develop new products, services, features, and functionality</li>
                    <li>To communicate with you for customer service, updates, and marketing</li>
                    <li>To process transactions and send related information</li>
                    <li>To detect, prevent, and address technical issues and fraud</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">4. Data Sharing and Disclosure</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Service Providers:</strong> We may share your information with third-party vendors and service providers that perform services for us or on our behalf.</li>
                    <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, or sale of assets.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information where required to comply with applicable law or legal processes.</li>
                    <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">5. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. We use industry-standard encryption, access controls, and regular security audits to protect your data.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">6. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">7. Your Privacy Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Right to access your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure of your data</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, please contact us at privacy@automsp.us.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">8. Cookies and Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">9. Third-Party Services</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform may contain links to third-party websites and services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">10. Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">11. Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-heading">12. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions or comments about this privacy policy, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-foreground font-semibold">AutoMSP</p>
                    <p className="text-muted-foreground">C1-1003, Burhani Centenary Park</p>
                    <p className="text-muted-foreground">Bhestan, Surat, Gujarat, India 395023</p>
                    <p className="text-muted-foreground">Email: privacy@automsp.us</p>
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

export default Privacy;
