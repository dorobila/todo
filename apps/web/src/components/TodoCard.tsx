import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CalendarIcon, Check, MoreVerticalIcon } from 'lucide-react';
import { Todo } from '../app/services';
import { formatDate } from '../lib/utils';

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div
      key={todo.id}
      className="bg-card text-card-foreground rounded-lg border shadow-sm min-w-[300px] max-w-xl"
    >
      <div className="flex flex-row items-start gap-2 p-4">
        <CheckboxPrimitive.Root className="border-primary h-4 w-4 shrink-0 rounded-sm border">
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <div className="flex-grow space-y-1 leading-none text-left">
          <p className="mb-2 text-base leading-none">{todo.title}</p>
          <p className="text-gray-500">{todo.description}</p>
          <p className="text-sm text-gray-500 flex flex-row items-center gap-1 w-[200px]">
            <CalendarIcon size={12} />
            {formatDate(new Date(todo.dueDate))}
          </p>
        </div>
        <MoreVerticalIcon size={20} />
      </div>
    </div>
  );
}
