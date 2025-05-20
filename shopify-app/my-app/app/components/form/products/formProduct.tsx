import {
  Form,
  FormLayout,
  Checkbox,
  TextField,
  Button,
} from "@shopify/polaris";
import { Node } from "app/routes/app.my-page";
import { useState, useCallback } from "react";
interface IFormOnSubmitProductProps {
  node: Node;
  setNode: (node: Node) => void;
  handleSubmit: () => void;
}
function FormOnSubmitProduct(props: IFormOnSubmitProductProps) {
  const { node, setNode, handleSubmit } = props;

  //   const handleSubmit = useCallback(() => {
  //     setEmail("");
  //     setNewsletter(false);
  //   }, []);

  //   const handleNewsLetterChange = useCallback(
  //     (value: boolean) => setNewsletter(value),
  //     [],
  //   );

  //   const handleEmailChange = useCallback((value: string) => setEmail(value), []);

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={node.title}
          onChange={(e) => setNode({ ...node, title: e })}
          label="Title"
          type="text"
          autoComplete=""
          helpText={
            <span>
              This is the title of the product.
              <a href="https://shopify.dev/api/admin-graphql/2023-10/objects/Product">
                Read more
              </a>
            </span>
          }
        />
        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
  );
}
export default FormOnSubmitProduct;
