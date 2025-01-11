import React from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

export const ChevronDownIcon = () => {
  return (
    <svg
      fill="none"
      height="14"
      viewBox="0 0 24 24"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
        fill="currentColor"
      />
    </svg>
  );
};

type DropdownOption = {
  key: string;
  label: string;
};

type DropdownMenuComponentProps = {
  options: DropdownOption[];
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  buttonLabel: string;
};

export const DropdownMenuComponent: React.FC<DropdownMenuComponentProps> = ({
  options,
  selectedKey,
  onSelectionChange,
  buttonLabel,
}) => {
  return (
    <ButtonGroup variant="flat">
      <Button>{buttonLabel}</Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Dropdown Menu"
          className="max-w-[300px]"
          selectedKeys={new Set([selectedKey])}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            onSelectionChange(key as string);
          }}
        >
          {options.map((option) => (
            <DropdownItem key={option.key} >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};
