function getScriptText(script: HTMLScriptElement): string {
  const shaderString = script.text.trim();

  return shaderString;
}

export default getScriptText;
