import React, { ReactElement } from "react";
import { ReactNode } from "react";
import SingleTab from "./parts/SingleTab";
import OptionalTab from "./parts/OptionalTab";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface SingleTabTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children:
    | ReactElement<typeof SingleTab | typeof OptionalTab>
    | ReactElement<typeof SingleTab | typeof OptionalTab>[];
  userData: any;
  errorData?: Map<string, string>;
  onTabChanged: (
    key: string,
    data: string,
    isOptional: boolean,
    optionalLang: string
  ) => void;
  onChanged: (value: string, name: string) => void;
  highlightColor: string;
  placeholder?: string;
  tabsClassName?: string;
  parentClassName?: string;
  title?: string;
  name: string;
}

const SingleTabTextarea = React.forwardRef<
  HTMLTextAreaElement,
  SingleTabTextareaProps
>((props, ref: any) => {
  const {
    className,
    name,
    tabsClassName,
    parentClassName,
    children,
    userData,
    errorData,
    onTabChanged,
    onChanged,
    highlightColor,
    placeholder,
    title,
    ...rest
  } = props;
  const selectionName = `${name}_selections`;

  const tabChanged = (
    tabName: string,
    isOptional: boolean = false,
    optionalLang: string
  ) => onTabChanged(selectionName, tabName, isOptional, optionalLang);
  const inputOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    onChanged(value, name);
  };
  const processTabs = (children: ReactNode) => {
    let selectedKey = userData[selectionName];
    const elements = React.Children.map(children, (child, mainIndex) => {
      if (React.isValidElement(child)) {
        const levelOneChildren = child.props.children;
        if (child.type === SingleTab) {
          // Rename for distinct data store e.g. username_english,
          const selectItemText = generateUniqueName(name, levelOneChildren);
          if (mainIndex === 0 && !selectedKey) {
            selectedKey = selectItemText;
          }
          const comp: ReactElement = child;
          let classNameOne = child.props.className;
          let newColor = "";
          if (errorData && errorData.get(selectItemText)) {
            newColor += " bg-red-500 ";
          } else {
            newColor =
              selectedKey === selectItemText
                ? ` ${highlightColor}`
                : mainIndex === 0 && !selectedKey
                ? ` ${highlightColor}`
                : "";
          }

          if (classNameOne) {
            classNameOne += newColor;
          } else {
            classNameOne = newColor;
          }

          return React.cloneElement(comp, {
            className: classNameOne,
            onClick: () => tabChanged(selectItemText, false, "farsi"), // Pass the tab value (children)
          });
        } else if (child.type === OptionalTab) {
          if (Array.isArray(levelOneChildren)) {
            if (mainIndex == 0 && !selectedKey) {
              selectedKey = generateUniqueName(
                name,
                levelOneChildren[0].props.children
              );
            }
            return (
              <div className="flex gap-1">
                {React.Children.map(levelOneChildren, (childInner, index) => {
                  const levelTwoChildren = childInner.props.children;
                  const selectItemTextInner = generateUniqueName(
                    name,
                    levelTwoChildren
                  );

                  let classNameOne = childInner.props.className;
                  let newColor = "";
                  if (errorData && errorData.get(selectItemTextInner)) {
                    newColor += " bg-red-500 ";
                  } else {
                    newColor =
                      selectedKey === selectItemTextInner
                        ? ` ${highlightColor}`
                        : mainIndex === 0 && !selectedKey
                        ? ` ${highlightColor}`
                        : "";
                  }
                  if (classNameOne) {
                    classNameOne += newColor;
                  } else {
                    classNameOne = newColor;
                  }
                  return (
                    <>
                      {React.cloneElement(childInner, {
                        className: classNameOne,
                        onClick: () =>
                          tabChanged(
                            selectItemTextInner,
                            true,
                            levelTwoChildren
                          ), // Pass the tab value (children)
                      })}
                      {index % 2 == 0 && (
                        <div className="font-semibold text-[18px] text-primary/80">
                          │
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            );
          } else if (mainIndex == 0 && !selectedKey) {
            selectedKey = generateUniqueName(
              name,
              levelOneChildren.props.children
            );
          }
        }
      }
      // return child; // Return unmodified child if it's neither SingleTab nor OptionalTab
    });
    const selectTab = userData[selectedKey];
    return { elements, selectTab, selectedKey };
  };
  const { elements, selectTab, selectedKey } = processTabs(children);
  return (
    <div className={cn("flex flex-col", parentClassName)}>
      {/* Title */}
      <h1 className="ltr:text-2xl-ltr rtl:text-2xl-rtl text-start font-semibold">
        {title}
      </h1>
      {/* Header */}
      <div className={cn("flex gap-x-4", tabsClassName)}>{elements}</div>
      {/* Body */}
      <Textarea
        {...rest}
        className={cn(
          "mt-2 focus-visible:ring-0 focus-visible:border-primary/30 focus-visible:ring-offset-0",
          className
        )}
        ref={ref}
        name={selectedKey}
        key={selectedKey}
        placeholder={placeholder}
        onChange={inputOnchange}
        defaultValue={selectTab}
      />
    </div>
  );
});

export default SingleTabTextarea;

const generateUniqueName = (name: string, transName: string) =>
  `${name}_${transName}`;
