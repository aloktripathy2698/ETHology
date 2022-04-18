import { Badge, Grid, Typography } from "@mui/material";
import React from "react";
import { GoVerified } from "react-icons/go";
import { getColorByAvailability } from "../utils";

const Legends = () => {
  return (
    <Grid container direction="row-reverse" spacing={2} paddingBottom={3}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("Finished"),
                  backgroundColor: getColorByAvailability("Finished"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Finished
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("Finishing"),
                  backgroundColor: getColorByAvailability("Finishing"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Finishing
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  color: getColorByAvailability("Available"),
                  backgroundColor: getColorByAvailability("Available"),
                },
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Available
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={0.5}>
          <Grid item>
            <GoVerified
              style={{
                marginTop: "0.45rem",
                height: "0.65rem",
                color: "#00acee",
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" fontWeight="bold" color="#616161">
              Verified
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Legends;
