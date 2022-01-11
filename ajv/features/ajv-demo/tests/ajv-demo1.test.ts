import AJV, { JSONSchemaType } from "ajv";

describe("AJV demo1", function () {
  test('ajv test 1', function() {
    const ajv = new AJV({allErrors: true});
    const data = { image: [{url: 'ddd.png'}], audio: [{url: 'xxx.mp3'}], startTime: Date.now()};
    const schema: JSONSchemaType<typeof data> = {
      type: 'object',
      properties: {
        startTime: {type: 'integer'},
        image: {type: 'array'},
        audio: {type: 'array'},
      },
      required: ['startTime'],
    };
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) console.log(validate.errors)
  });
});
