import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface TeamInvitationEmailProps {
  userName: string;
  verificationUrl: string;
  storeName: string;
  role: string;
}

const EmailVerfication = (props: TeamInvitationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        You&apos;ve been invited to join our store team - Verify your email to
        get started
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
            <Section>
              <Heading className="text-[32px] font-bold text-gray-900 text-center mb-[32px]">
                Welcome to Our Team
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[24px]">
                Hello {props.userName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                You&apos;ve been invited to join our store team as a{" "}
                <span className="font-bold">{props.role}</span>! We&apos;re
                excited to have you on board and look forward to working
                together.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-[24px]">
                To complete your registration and verify your email address,
                please click the button below:
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={props.verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                >
                  Verify Email & Join Team
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] break-all">
                {props.verificationUrl}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                <strong>What&apos;s next?</strong>
              </Text>

              <Text className="text-[14px] text-gray-700 mb-[8px]">
                • Access to our store management dashboard
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px]">
                • Team collaboration tools and resources
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[24px]">
                • Training materials and support documentation
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[32px] leading-[20px]">
                This invitation link will expire in 48 hours for security
                reasons. If you have any questions or need assistance, feel free
                to reach out to our team.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[8px]">
                Best regards,
              </Text>
              <Text className="text-[16px] text-gray-700 font-semibold">
                {props.storeName} Team
              </Text>
            </Section>

            <Section className="border-t border-solid border-gray-200 pt-[32px] mt-[40px]">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                {props.storeName}
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                Berbera, Somaliland, suuqa bacadlayasha
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[16px]">
                © 2026 {props.storeName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerfication.PreviewProps = {
  userName: "John Doe",
  verificationUrl: "https://yourstore.com/verify?token=abc123xyz789",
  storeName: "Your Store",
  role: "Admin",
};

export default EmailVerfication;
