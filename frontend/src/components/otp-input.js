// components/OtpInput.tsx

const OtpInput = (props) => {
    const {
        //Set the default size to 6 characters
        size = 6,
        //Default validation is digits
        validationPattern = /[0-9]{1}/,
        value,
        onChange,
        className,
        ...restProps
    } = props;

    const handleInputChange = (
        e,
        index
    ) => {
        const elem = e.target;
        const val = e.target.value;
        // check if the value is valid
        if (!validationPattern.test(val) && val !== "") return;

        // change the value of the upper state using onChange
        const valueArr = value.split("");
        valueArr[index] = val;
        const newVal = valueArr.join("").slice(0, 6);
        onChange(newVal);

        //focus the next element if there's a value
        if (val) {
            const next = elem.nextElementSibling || null;
            next?.focus();
        }
    };
    const handleKeyUp = (e) => {
        const current = e.currentTarget;
        if (e.key === "ArrowLeft" || e.key === "Backspace") {
            const prev = current.previousElementSibling || null;
            prev?.focus();
            prev?.setSelectionRange(0, 1);
            return;
        }

        if (e.key === "ArrowRight") {
            const prev = current.nextSibling || null;
            prev?.focus();
            prev?.setSelectionRange(0, 1);
            return;
        }
    };
    const handlePaste = (e) => {
        e.preventDefault();
        const val = e.clipboardData.getData("text").substring(0, size);
        onChange(val);
    };
    const arr = new Array(size).fill("-");
    return (
        <div className="flex gap-2">
            {/* Map through the array and render input components */}
            {arr.map((_, index) => {
                return (
                    <input
                        key={index}
                        {...restProps}
                        /**
                         * Add some styling to the input using daisyUI + tailwind.
                         * Allows the user to override the className for a different styling
                         */
                        className={className || `input input-bordered px-0 text-center`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern={validationPattern.source}
                        maxLength={6}
                        value={value.at(index) ?? ""}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyUp={handleKeyUp}
                        onPaste={handlePaste}
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;