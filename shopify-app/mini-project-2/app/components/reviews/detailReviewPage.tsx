import {
  Badge,
  BlockStack,
  Box,
  Card,
  Divider,
  InlineStack,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { Ireviews } from "app/interfaces/reviews";

import ImageReview from "./imageReview";
import Star from "./star";

const DetailReview = ({ review }: { review: Ireviews }) => {
  return (
    <BlockStack gap={"200"}>
      <InlineStack gap={"200"}>
        <Box width="48%">
          <Card>
            <BlockStack gap={"025"}>
              <Text as="h1" variant="headingLg">
                Author:
              </Text>
              <Text as="p">Id: {review.customer_id}</Text>
              <Text as="p">
                Name: {review.customers.firstName} {review.customers.lastName}
              </Text>
              <Text as="p">Email: {review.customers.email}</Text>
            </BlockStack>
          </Card>
        </Box>
        <Box width="50%">
          <Card>
            <BlockStack gap={"050"}>
              <Text as="h1" variant="headingLg">
                Infor Review:
              </Text>
              <Text as="p">
                createAt:{" "}
                {new Date(review.created_at).toLocaleDateString("vi-VN")}
              </Text>
              <InlineStack gap={"050"}>
                <Text as="span">Approved:</Text>
                <Box>
                  {review.approved ? (
                    <Badge tone="success">True</Badge>
                  ) : (
                    <Badge tone="critical">False</Badge>
                  )}
                </Box>
              </InlineStack>
              <Text as="span">Award: {review.award} Points</Text>
              <InlineStack>
                <Text as="span">Rating:</Text>
                <Star numberStarts={review.rating} />
              </InlineStack>
            </BlockStack>
          </Card>
        </Box>
      </InlineStack>

      {review.images && review.images.length > 0 && (
        <BlockStack gap={"200"}>
          <Text as="h1" variant="headingLg">
            Images of the Review
          </Text>
          <InlineStack gap={"200"}>
            {review.images &&
              review.images.length > 0 &&
              review.images.map((item, index) => {
                return (
                  <Box as="div" key={index}>
                    <ImageReview images={item} />
                  </Box>
                );
              })}
          </InlineStack>
        </BlockStack>
      )}

      <BlockStack>
        <TextField
          label="Review Content"
          value={review.content}
          multiline={4}
          autoComplete="off"
        />
      </BlockStack>
    </BlockStack>
  );
};

export default DetailReview;
