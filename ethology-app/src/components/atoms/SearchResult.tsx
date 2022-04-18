import { Card, CardMedia, CardContent, Typography, Stack } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ISearchResult } from "../../interfaces/interface";
import TextAnnotation from "../molecules/TextAnnotation";
import { cardStyles } from "../styles/card-styles";
import { getColorByAvailability } from "../utils";
import { GoVerified } from "react-icons/go";
import { Box } from "@mui/system";

const SearchResult = (props: ISearchResult) => {
  const classes = cardStyles();

  return (
    <Card className={classes.root}>
      <CardMedia />
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" className={classes.title}>
            {props.annotation.manufac_id ? (
              props.routeToWeb ? (
                <a
                  style={{
                    color: getColorByAvailability(
                      props.annotation.availability?.toLowerCase() || "available"
                    ),
                  }}
                  href={`https://twitter.com/${props.annotation.manufac_id}/status/${props.annotation.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.title}
                </a>
              ) : props.annotation.availability?.toLowerCase() !==
                "finished" ? (
                <Link
                  className={classes.link}
                  to={`/search-details?price=${props.annotation.price}&id=${props.annotation.id}&poi=${props.annotation.manufac_name}&country=${props.annotation.country}`}
                  style={{
                    color: getColorByAvailability(
                      props.annotation.availability?.toLowerCase() || "available"
                    ),
                  }}
                >
                  {props.title}
                </Link>
              ) : (
                <div
                  style={{
                    color: getColorByAvailability(
                      props.annotation.availability?.toLowerCase() || "available"
                    ),
                  }}
                >
                  {props.title}
                </div>
              )
            ) : (
              <Box
                style={{
                  color: getColorByAvailability(
                    props.annotation.availability?.toLowerCase() || "available"
                  ),
                }}
              >
                {props.title}
              </Box>
            )}
            {/* </Link> */}
            {props.annotation.verified && (
              <GoVerified
                style={{
                  marginLeft: "0.25rem",
                  height: "0.85rem",
                  color: "#00acee",
                }}
              />
            )}
          </Typography>
          <Typography variant="body2" className={classes.annotation}>
            <TextAnnotation
              country={props.annotation.country}
              verified={props.annotation.verified}
              manufac_name={props.annotation.manufac_name}
              time={props.subtitle}
              availability={props.annotation.availability}
              sentiment_score={props.annotation.sentiment_score}
            />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SearchResult;
