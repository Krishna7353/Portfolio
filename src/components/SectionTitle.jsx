import { useInView } from "../hooks.js";
import ScrambleText from "./ScrambleText.jsx";

export default function SectionTitle({ children, className = "" }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <h2 className={"h2 " + className} ref={ref}>
      <ScrambleText text={children} play={seen} block />
    </h2>
  );
}
