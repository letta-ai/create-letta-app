interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input(props: InputProps) {
    const { label: l, ...rest } = props
    return (
        <label className="flex flex-col gap-1">
            <span className="text-sm font-bold">{l}</span>
            <input
                {...rest}
                className="w-full border p-2 rounded-sm mb-4"
            />
        </label>
    )
}