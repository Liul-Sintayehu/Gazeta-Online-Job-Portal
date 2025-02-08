import React from "react";

const PrimaryButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<'button'> & { className?: string }
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={`h-8 gap-1 bg-primary py-1 px-2 duration-200 text-white rounded-xl text-xs flex items-center justify-center ${className}`}
        {...props}
    />
));
PrimaryButton.displayName = 'PrimaryButton';

const OutlineButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<'button'> & { className?: string }
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={`h-8 w-8 gap-1 md:w-auto border py-1 px-2 duration-200 hover:bg-gray-100 rounded-xl text-xs all-center ${className}`}
        {...props}
    />
));
OutlineButton.displayName = 'OutlineButton';

export { PrimaryButton, OutlineButton };
