/**
 * Editorial headline treatment: the final word is set in the italic cut of the display face,
 * in burgundy, the way a magazine headline leans on one word. Works for any language because
 * it only splits on the last space.
 */
export function Accent({ text }: { text: string }) {
  const i = text.trimEnd().lastIndexOf(" ");
  if (i === -1) return <em className="accent-word">{text}</em>;
  return (
    <>
      {text.slice(0, i)} <em className="accent-word">{text.slice(i + 1)}</em>
    </>
  );
}
