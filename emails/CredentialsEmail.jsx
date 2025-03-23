// //this is the template made using react email and integrating resend
// import {
//     Html,
//     Head,
//     Font,
//     Preview,
//     Heading,
//     Row,
//     Section,
//     Text,
//     Button,  
//   } from '@react-email/components';

  
//   export default function VerificationEmail({name, tempPassword}) {
//     return (
//       <Html lang="en" dir="ltr">
//         <Head>
//           <title>Credential Access</title>
//           <Font
//             fontFamily="Roboto"
//             fallbackFontFamily="Verdana"
//             webFont={{
//               url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
//               format: 'woff2',
//             }}
//             fontWeight={400}
//             fontStyle="normal"
//           />
//         </Head>
//         <Preview>Here&apos;s your credentials: {tempPassword}</Preview>
//         <Section>
//           <Row>
//             <Heading as="h2">Hello {name},</Heading>
//           </Row>
//           <Row>
//             <Text>
//               Thank you for registering. Please use the following verification
//               code to complete your registration:
//             </Text>
//           </Row>
//           <Row>
//             <Text>{tempPassword}</Text> 
//           </Row>
//           <Row>
//             <Text>
//               If you did not request this code, please ignore this email.
//             </Text>
//           </Row>
//           {/* <Row>
//             <Button
//               href={`http://localhost:3000/verify/${username}`}
//               style={{ color: '#61dafb' }}
//             >
//               Verify here
//             </Button>
//           </Row> */}
//         </Section>
//       </Html>
//     );
//   }
import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Container,
  } from "@react-email/components";
  
  export default function VerificationEmail({ name, tempPassword }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Credential Access</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        {/* <Preview>Here are your login credentials: {tempPassword}</Preview> */}
  
        <Section style={{ backgroundColor: "#f4f4f4", padding: "20px" }}>
          <Container
            style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Heading as="h2" style={{ color: "#333", marginBottom: "10px" }}>
              Welcome, {name}!
            </Heading>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              You have been registered successfully. Please ask your supervisor for the temporary password to log in to your account.
            </Text>
  
            <Text
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#007BFF",
                backgroundColor: "#f0f0f0",
                padding: "10px",
                borderRadius: "5px",
                display: "inline-block",
                margin: "15px 0",
              }}
            >
              {tempPassword}
            </Text>
  
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Once you log in, you will be prompted to reset your password for
              security reasons.
            </Text>
  
            <Text style={{ fontSize: "16px", color: "#555", marginTop: "15px" }}>
              If you did not request this email, please ignore it.
            </Text>
  
            {/* Optional Button (if login link is available) */}
            {/* <Button
              href={`http://yourwebsite.com/login`}
              style={{
                backgroundColor: "#007BFF",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                textDecoration: "none",
                marginTop: "20px",
                display: "inline-block",
              }}
            >
              Login Now
            </Button> */}
          </Container>
        </Section>
      </Html>
    );
  }
  