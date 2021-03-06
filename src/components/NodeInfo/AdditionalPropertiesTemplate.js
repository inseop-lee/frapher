import React from "react";

import { MdClose } from "react-icons/md";
import { Button, Form } from "react-bootstrap";

// function IconButton(props) {
//   const { type = "default", icon, className, ...otherProps } = props;
//   return (
//     <button
//       type="button"
//       className={`btn btn-${type} ${className}`}
//       {...otherProps}
//     >
//       <i className={`glyphicon glyphicon-${icon}`} />
//     </button>
//   );
// }

function AdditionalPropertiesTemplate(props) {
  const {
    id,
    classNames,
    children,
    disabled,
    label,
    onKeyChange,
    onDropPropertyClick,
    readonly,
    required
  } = props;

  return (
    <div className={classNames + " additional"}>
      <Form.Control
        type="text"
        required={required}
        id={`${id}-key`}
        onBlur={e => onKeyChange(e.target.value)}
        className="ap-key"
        defaultValue={label}
        size="sm"
      />
      <div className="ap-value">{children}</div>
      <Button
        variant="outline-danger"
        className="array-item-remove"
        disabled={disabled || readonly}
        onClick={onDropPropertyClick(label)}
        size="sm"
      >
        <MdClose />
      </Button>
    </div>
  );
}

export default AdditionalPropertiesTemplate;
