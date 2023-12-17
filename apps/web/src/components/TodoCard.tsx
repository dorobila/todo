import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CalendarIcon, Check, MoreVerticalIcon } from 'lucide-react';
import { Todo } from '../app/services';
import { cn, formatDate } from '../lib/utils';
import { isBefore, isToday, isTomorrow, startOfDay } from 'date-fns';

export default function TodoCard({ todo }: { todo: Todo }) {
  const dueDate = new Date(todo.dueDate);
  const formattedDate = isToday(dueDate)
    ? 'Today'
    : isTomorrow(dueDate)
      ? 'Tomorrow'
      : formatDate(dueDate);

  return (
    <div
      key={todo.id}
      className="bg-card text-card-foreground min-w-[300px] max-w-xl rounded-lg border shadow-sm"
    >
      <div className="flex flex-row items-start gap-2 p-4">
        <CheckboxPrimitive.Root
          checked={todo.status === 'completed'}
          className="border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <div className="flex-grow space-y-1 text-left leading-none">
          <p
            className={cn(
              'mb-2 text-base leading-none',
              todo.status === 'completed' && 'text-muted-foreground line-through',
            )}
          >
            {todo.title}
          </p>
          <p className="text-gray-500">{todo.description}</p>
          <p
            className={cn(
              'flex w-[200px] flex-row items-center justify-start gap-1 text-left text-sm font-normal text-gray-500',
              todo.dueDate &&
                isBefore(new Date(todo.dueDate), startOfDay(new Date())) &&
                'text-destructive',
            )}
          >
            <CalendarIcon size={12} /> {formattedDate}
          </p>
        </div>
        <MoreVerticalIcon size={20} />
      </div>
    </div>
  );
}
