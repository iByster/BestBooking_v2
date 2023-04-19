import React, { useState, useRef, useEffect } from "react";
import { createPopper, VirtualElement, Modifier } from "@popperjs/core";
import useOutsideClick from "../../hooks/useOutsideClick";

interface Props {
  trigger: JSX.Element;
  children: JSX.Element;
  placement?:
    | "auto"
    | "auto-start"
    | "auto-end"
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  modifiers?: Modifier<any, any>[];
}

const Popper: React.FC<Props> = ({
  trigger,
  children,
  placement = "bottom",
  modifiers = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popperInstanceRef = useRef<any>(null);
  // const ref = useRef<HTMLDivElement>(null);
  // useOutsideClick(popperElement, () => {
  //   setIsOpen(false);
  // });

  useEffect(() => {
    if (triggerRef.current && popperElement) {
      const virtualElement: VirtualElement = {
        getBoundingClientRect: () =>
          triggerRef.current!.getBoundingClientRect(),
        contextElement: document.body,
      };
      const popperInstance = createPopper(virtualElement, popperElement, {
        placement,
        modifiers: [
          {
            name: "arrow",
            options: { element: arrowElement },
          },
          ...modifiers,
        ],
      });
      popperInstanceRef.current = popperInstance;

      return () => {
        popperInstance.destroy();
        popperInstanceRef.current = null;
      };
    }
  }, [popperElement, triggerRef, placement, arrowElement, modifiers]);

  const handleToggleOpen = () => setIsOpen(!isOpen);

  // const ref = useRef<HTMLDivElement>(null);
  // const handleOutsideClick = () => setIsOpen(false);
  // useOutsideClick(ref, handleOutsideClick);

  return (
    <>
      <div
        ref={setPopperElement}
        style={{ display: isOpen ? "block" : "none" }}
      >
        {children}
        <div
          ref={setArrowElement}
          style={{
            width: 10,
            height: 10,
            transform: "rotate(45deg)",
            backgroundColor: "white",
            position: "absolute",
          }}
        />
      </div>
      <div ref={triggerRef} onClick={handleToggleOpen}>
        {trigger}
      </div>
    </>
  );
};

export default Popper;
