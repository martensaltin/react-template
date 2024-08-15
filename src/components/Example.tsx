import React from "react";
import styled from "styled-components";

export interface Props {}

export const Example: React.FC<Props> = (props) => {
  return <Wrapper type="button">Exempel</Wrapper>;
};
const Wrapper = styled.button``;
