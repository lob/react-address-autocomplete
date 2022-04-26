let baseStyles = {
  lob_container: {
    display: 'flex',
    flexDirection: 'column'
  },
  /* Mimics UI of react-select for consistency */
  lob_input: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    border: 'solid 1px hsl(0, 0%, 80%)',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '38px',
    outline: 0,
    padding: '0px 8px',
    width: '100%'
  },
  lob_label: {
    alignSelf: 'center',
    minWidth: '5em',
    marginRight: '1em',
    textAlign: 'end'
  },
  lob_row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '1em'
  }
}
// eslint-disable-next-line
export default (userStyles, isInternational) => {
  const mergedStyles = {}

  if (isInternational) {
    baseStyles = {
      ...baseStyles,
      lob_label: {
        ...baseStyles.lob_label,
        minWidth: '8em'
      }
    }
  }

  Object.keys(baseStyles).forEach((key) => {
    mergedStyles[key] =
      key in userStyles ? userStyles[key](baseStyles[key]) : baseStyles[key]
  })

  return mergedStyles
}
