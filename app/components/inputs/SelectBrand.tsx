import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface SelectBrandProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const SelectBrand: React.FC<SelectBrandProps> = ({
  id,
  label,
  options,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        className={`peer w-full p-4 pt-6 border-2 rounded-md transition ${
          errors[id] ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-gray-400"
        } bg-white font-light outline-none disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        <option value="" disabled hidden>
          
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`absolute 
          text-gray-400 
          top-5 left-4 
          text-md 
          transition 
          transform 
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0 peer-focus:scale-75 
          peer-focus:-translate-y-4 ${
          errors[id] && "text-red-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default SelectBrand;