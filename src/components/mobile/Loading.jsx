import styled, { keyframes } from "styled-components";

// // 1. Create a shimmering animation
// const shimmer = keyframes`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `;

// // 2. Base skeleton block
// const SkeletonBase = styled.div`
//   background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//   background-size: 200% 100%;
//   animation: ${shimmer} 1.5s infinite linear;
//   border-radius: 4px;
// `;

// // 3. Custom layout shapes
// const PageWrapper = styled.div`
//   padding: 2rem;
//   max-width: 600px;
//   min-height: 100vh;
//   margin: 0 auto;
// `;

// const SkeletonTitle = styled(SkeletonBase)`
//   height: 32px;
//   width: 60%;
//   margin-bottom: 1.5rem;
// `;

// const SkeletonText = styled(SkeletonBase)`
//   height: 16px;
//   width: 100%;
//   margin-bottom: 0.75rem;
// `;

// // Usage Component
// export default function LoadingComponent() {
//   return (
//     <PageWrapper>
//       <SkeletonTitle />
//       <SkeletonText />
//       <SkeletonText style={{ width: "90%" }} />
//       <SkeletonText style={{ width: "40%" }} />
//     </PageWrapper>
//   );
// }

// ALTERNATIVE SIMPLER SPINNER COMPONENT

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db; /* Your brand color */
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export default function LoadingComponent() {
  return (
    <CenteredContainer>
      <Spinner />
    </CenteredContainer>
  );
}
