import * as React from "react";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText, { ListItemTextProps } from "@mui/material/ListItemText";

export function generateListItems(
  listItems: {
    id: string;
    label: string;
    buttonProps?: ListItemButtonProps;
    icon: React.ReactNode;
    textProps?: ListItemTextProps;
  }[]
) {
  return (
    <>
      {listItems.map((item) => (
        <ListItemButton key={item.id} {...item.buttonProps}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText {...item.textProps}>{item.label}</ListItemText>
        </ListItemButton>
      ))}
    </>
  );
}
