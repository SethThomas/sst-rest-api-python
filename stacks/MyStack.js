import * as sst from "@serverless-stack/resources";
import { LayerVersion } from "@aws-cdk/aws-lambda";

const layerArn =
  "arn:aws:lambda:us-east-1:770693421928:layer:Klayers-python38-numpy:24";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const layer = LayerVersion.fromLayerVersionArn(this, "Layer", layerArn);

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        srcPath: "src",
      },
      routes: {
        "GET /notes": {
          function: {
            handler: "list.main",
            // Load numpy in a Layer
            layers: [layer],
            // Exclude bundling it in the Lambda function
            bundle: { externalModules: ["Klayers-python38-numpy"] },
          },
        },
        "GET /notes/{id}": "get.main",
        "PUT /notes/{id}": "update.main",
      },
    });

    // Show API endpoint in output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
