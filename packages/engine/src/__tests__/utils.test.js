const { normalizeColor } = require("../utils");

describe("normalizeColor", () => {
  it("should return a lowercase hex code with a hash for a named color", () => {
    expect(normalizeColor("red")).toBe("#ff0000");
    // Test case-insensitivity
    expect(normalizeColor("RED")).toBe("#ff0000");
  });

  it("should return a consistent lowercase hex code if a hex code is provided", () => {
    // Test with hash and uppercase
    expect(normalizeColor("#00FF00")).toBe("#00ff00");
  });

  it("should handle hex codes without a hash and return a lowercase hex with a hash", () => {
    // Test without hash and uppercase
    expect(normalizeColor("0000FF")).toBe("#0000ff");
  });

  it("should return a default black color for invalid input", () => {
    expect(normalizeColor("not-a-real-color")).toBe("#000000");
    expect(normalizeColor(null)).toBe("#000000");
    expect(normalizeColor(undefined)).toBe("#000000");
    expect(normalizeColor("12345")).toBe("#000000"); // Invalid hex
  });
});
