import { Skeleton, keyframes, styled } from "@mui/material";

const bounceAnimation = keyframes`0% {transform:scale(1);} 50% {transform:scale(1.5);} 100%{transform:scale(1);}`;
const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} is infinite`,
}));

export { BouncingSkeleton };

