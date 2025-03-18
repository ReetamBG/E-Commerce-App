const FormField = (props) => {
  const { type, name, id, value, placeholder, onChange } = props
  return (
    <div className="flex flex-col m-1">
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        required
        placeholder={placeholder}
        onChange={onChange}
        className="m-2 p-3 border border-gray-300 
                rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-blue-300 transition duration-250"
      />
    </div>
  )
}

export default FormField