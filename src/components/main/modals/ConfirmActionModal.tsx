import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { ConfirmActionProps } from "../../../types";

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  isOpen,
  title = "Confirm Action with a note",
  description = "send request with note",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  modalPlacement = "center",
  onConfirm,
  onCancel,
  note,
  handleNoteChange
}) => {
  return (
    <Modal
      isOpen={isOpen}
      placement={modalPlacement}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel(); // Trigger cancel when modal closes
      }}
      aria-labelledby="confirm-action-title"
      aria-describedby="confirm-action-description"
    >
      <ModalContent>
        <>
          <ModalHeader
            id="confirm-action-title"
            className="flex flex-col gap-1 text-center"
          >
            {title}
          </ModalHeader>
          <ModalBody>
            <p
              id="confirm-action-description"
              className="text-sm text-gray-700"
              >
              {description}
              </p>
              <Textarea
                variant="bordered"
                labelPlacement="outside"
                placeholder="write a note to send"
                value={note}
                className="max-w-xs"
                onChange={handleNoteChange}
              />
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button
              color="default"
              variant="light"
              onPress={onCancel}
              className="font-medium"
              aria-label={cancelLabel}
            >
              {cancelLabel}
            </Button>
            <Button
              color="success"
              onPress={onConfirm}
              className="font-medium"
              aria-label={confirmLabel}
            >
              {confirmLabel}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAction;
