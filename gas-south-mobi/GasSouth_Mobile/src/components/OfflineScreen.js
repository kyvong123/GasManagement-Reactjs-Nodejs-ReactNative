import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Button,
  WingBlank,
  Flex,
  Card,
  WhiteSpace
} from "@ant-design/react-native/lib/";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start"
  }
});
class OfflineScreen extends Component {
  render() {
    return (
      <Flex style={styles.container}>
        <Flex.Item>
          <Card>
            <Card.Header>
              <WingBlank>
                <Text>Không có kết nối Internet</Text>
              </WingBlank>
            </Card.Header>
            <Card.Body>
              <WingBlank>
                <Text>Vui lòng kiểm tra lại kết nối Internet của bạn</Text>
              </WingBlank>
            </Card.Body>
          </Card>
        </Flex.Item>
      </Flex>
    );
  }
}

export default OfflineScreen;
