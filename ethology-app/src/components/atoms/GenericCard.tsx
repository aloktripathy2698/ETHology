// Generic card component  using the same styling as in rest of the application

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Badge,
} from "@mui/material";

import { IGenericCard } from "../../interfaces/interface";
import { cardStyles } from "../styles/card-styles";

const GenericCard = (props: IGenericCard) => {
  const classes = cardStyles();

  return (
    <Card className={classes.root}>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default GenericCard;
