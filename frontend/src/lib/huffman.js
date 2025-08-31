// lib/huffman.js
export function buildFrequencyMap(text) {
  const freq = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}

function buildTree(freq) {
  const nodes = Object.entries(freq).map(([char, freq]) => ({ char, freq }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({
      freq: left.freq + right.freq,
      left,
      right,
    });
  }
  return nodes[0];
}

function buildCodes(node, prefix = "", map = {}) {
  if (node.char !== undefined) {
    map[node.char] = prefix;
    return map;
  }
  if (node.left) buildCodes(node.left, prefix + "0", map);
  if (node.right) buildCodes(node.right, prefix + "1", map);
  return map;
}

export function huffmanEncode(text) {
  if (!text) return { encoded: "", tree: null };

  const freq = buildFrequencyMap(text);
  const tree = buildTree(freq);
  const codes = buildCodes(tree);

  const encoded = text
    .split("")
    .map((ch) => codes[ch])
    .join("");
  return { encoded, tree };
}

export function huffmanDecode(encoded, tree) {
  if (!encoded || !tree) return "";

  let result = "";
  let node = tree;

  for (const bit of encoded) {
    node = bit === "0" ? node.left : node.right;
    if (node.char !== undefined) {
      result += node.char;
      node = tree;
    }
  }
  return result;
}
