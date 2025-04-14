import classNames from "classnames";
import {useMemo} from "react";

interface AvatarProps {
    name: string;
    className?: string;
}

export function Avatar(props: AvatarProps) {
    const { className} = props;
    const initials = useMemo(() => {
        return props.name.split(' ').map(word => word[0]).join('').toUpperCase()
    }, [props.name]);


    return (
        <div
            className={classNames('p-2 h-6 w-6 flex items-center justify-center text-xs  rounded-sm', className)}>
            {initials}
        </div>
    )
}