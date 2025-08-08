const { generate } = require("../index");

// A minimal, valid template for testing purposes
const sampleTemplate = {
  pageSettings: {
    size: "a4",
    orientation: "portrait",
    marginTop: 50,
    marginLeft: 50,
  },
  pages: [
    {
      elements: [
        {
          id: "title",
          type: "Text",
          x: 0,
          y: 0,
          width: 200,
          height: 50,
          text: "Test Document",
        },
        {
          id: "name",
          type: "Text",
          x: 0,
          y: 60,
          width: 200,
          height: 20,
          dataBinding: { property: "text", field: "user.name" },
        },
      ],
    },
  ],
};

const sampleData = {
  user: { name: "John Doe" },
};

describe("AavanamKit Engine - Main Generate Function", () => {
  it("should generate a PDF buffer without crashing", async () => {
    // We expect the promise not to be rejected (i.e., not to throw an error)
    await expect(
      generate({
        template: sampleTemplate,
        data: sampleData,
        outputType: "pdf",
      })
    ).resolves.toBeDefined();
  });

  it("should return a Buffer object for PDF output", async () => {
    const result = await generate({
      template: sampleTemplate,
      data: sampleData,
      outputType: "pdf",
    });
    // Check if the output is a valid Buffer
    expect(result).toBeInstanceOf(Buffer);
  });

  it("should return a non-empty Buffer for PDF output", async () => {
    const result = await generate({
      template: sampleTemplate,
      data: sampleData,
      outputType: "pdf",
    });
    // A valid PDF will have a size greater than zero
    expect(result.length).toBeGreaterThan(0);
  });
});
