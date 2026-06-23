type TProps = {
  data: unknown;
};

/**
 * Renders a JSON-LD structured-data block.
 *
 * `data` must come from a trusted server-side source (i18n, config,
 * build-time generated). NEVER pass user input. Strings inside `data`
 * are JSON-encoded (quotes escaped), and we additionally replace `<`
 * with its `<` escape so a stray `</script>` inside the data
 * cannot terminate the surrounding script element early.
 */
export const JsonLd = ({ data }: TProps) => {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};
