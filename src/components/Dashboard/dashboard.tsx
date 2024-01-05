import * as React from "react";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText, { ListItemTextProps } from "@mui/material/ListItemText";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function generateListItems(
  listItems: {
    id: string;
    label: string;
    url?: string;
    buttonProps?: ListItemButtonProps;
    icon: React.ReactNode;
    textProps?: ListItemTextProps;
  }[],
  router?: AppRouterInstance,
  pathName?: string
) {
  return (
    <>
      {listItems.map((item) => (
        <ListItemButton
          key={item.id}
          onClick={() => {
            item.url && router && router.push(`${item.url}`);
          }}
          selected={pathName === item.url}
          {...item.buttonProps}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText {...item.textProps}>{item.label}</ListItemText>
        </ListItemButton>
      ))}
    </>
  );
}
