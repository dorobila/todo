import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  CalendarIcon,
  Check,
  ChevronDown,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import {
  Todo,
  useCompleteTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from '../app/services';
import { cn, formatDate, getPreselectedValue } from '../lib/utils';
import { addDays, format, isBefore, isToday, isTomorrow, startOfDay } from 'date-fns';
import { Form, FormControl, FormErrorMessage, FormField, FormItem, FormLabel } from './ui/Form';
import { Button } from './ui/Button';
import Calendar from './ui/Calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema } from '../lib/validations/todo';

export default function TodoCard({ todo }: { todo: Todo }) {
  const [editTodo, { isLoading: isEditing }] = useEditTodoMutation();
  const [deleteTodo, { isLoading: isDeliting }] = useDeleteTodoMutation();
  const [completeTodo] = useCompleteTodoMutation();

  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const dueDate = new Date(todo.dueDate);
  const formattedDate = isToday(dueDate)
    ? 'Today'
    : isTomorrow(dueDate)
      ? 'Tomorrow'
      : formatDate(dueDate);

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      dueDate: new Date(todo.dueDate),
    },
  });

  const onSubmit = (values: z.infer<typeof todoSchema>) => {
    // Todo: add ordinal when dnd is done.
    const valuesToSubmit: Pick<Todo, 'title' | 'description' | 'dueDate' | 'id'> = {
      id: todo.id,
      ...values,
    };

    editTodo(valuesToSubmit).unwrap();
    setOpen((prev) => !prev);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div
      key={todo.id}
      className="bg-card text-card-foreground min-w-[300px] max-w-xl overflow-hidden rounded-lg border shadow-sm"
    >
      <div className="flex flex-row items-start gap-2 p-4">
        <CheckboxPrimitive.Root
          className="border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          checked={todo.status === 'completed'}
          onCheckedChange={(checked) => {
            if (checked) {
              completeTodo({
                id: todo.id,
                status: 'completed',
              });
            } else {
              completeTodo({
                id: todo.id,
                status: 'pending',
              });
            }
          }}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <div className="max-w-[300px] flex-grow space-y-1 text-left leading-none">
          <p
            className={cn(
              'mb-2 break-all text-base leading-none',
              todo.status === 'completed' && 'text-muted-foreground line-through',
            )}
          >
            {todo.title}
          </p>
          <p className="max-w-[300px] break-all text-gray-500">{todo.description}</p>
          <p
            className={cn(
              'flex w-[200px] flex-row items-center justify-start gap-1 text-left  text-sm font-normal text-gray-500',
              todo.dueDate &&
                isBefore(new Date(todo.dueDate), startOfDay(new Date())) &&
                'text-destructive',
            )}
          >
            <CalendarIcon size={12} /> {formattedDate}
          </p>
        </div>
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger className="ring-offset-background focus-visible:ring-ring rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
            <MoreVerticalIcon size={20} />
          </DropdownMenuPrimitive.Trigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content className="bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md">
              <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
                <DialogPrimitive.Trigger asChild>
                  <DropdownMenuPrimitive.Item
                    onSelect={(e) => e.preventDefault()}
                    className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                  >
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuPrimitive.Item>
                </DialogPrimitive.Trigger>
                <DialogPrimitive.Portal>
                  <DialogPrimitive.Overlay className="bg-background/50 fixed inset-0 z-50 backdrop-blur-sm" />
                  <DialogPrimitive.Content className="bg-background fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border p-6 shadow-lg sm:rounded-lg">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                          <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                            Create a new Todo
                          </DialogPrimitive.Title>
                        </div>
                        <div className="grid gap-4 py-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder="Christmas shopping"
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                  />
                                </FormControl>
                                <FormErrorMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <textarea
                                    {...field}
                                    placeholder="We wish you a merry Christmas"
                                    className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
                                  />
                                </FormControl>
                                <FormErrorMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due date</FormLabel>
                                <FormControl>
                                  <PopoverPrimitive.Root
                                    open={isCalendarPopoverOpen}
                                    onOpenChange={setIsCalendarPopoverOpen}
                                  >
                                    <PopoverPrimitive.Trigger asChild>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'w-[200px] justify-start text-left font-normal',
                                          !field.value && 'text-muted-foreground',
                                          field.value &&
                                            isBefore(field.value, startOfDay(new Date())) &&
                                            'text-destructive',
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                          format(field.value, 'PPP')
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                      </Button>
                                    </PopoverPrimitive.Trigger>
                                    <PopoverPrimitive.Portal>
                                      <PopoverPrimitive.Content className="bg-popover text-popover-foreground z-50 flex w-auto flex-col space-y-2 rounded-md border p-2 shadow-md outline-none ">
                                        <SelectPrimitive.Root
                                          onValueChange={(value: string) =>
                                            field.onChange(addDays(new Date(), parseInt(value)))
                                          }
                                        >
                                          <SelectPrimitive.Trigger className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 [&>span]:line-clamp-1">
                                            <SelectPrimitive.Value
                                              placeholder={getPreselectedValue(
                                                new Date(todo.dueDate),
                                              )}
                                            />
                                            <SelectPrimitive.Icon asChild>
                                              <ChevronDown className="h-4 w-4 opacity-50" />
                                            </SelectPrimitive.Icon>
                                          </SelectPrimitive.Trigger>
                                          <SelectPrimitive.Portal>
                                            <SelectPrimitive.Content
                                              position="popper"
                                              className="bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                                            >
                                              <SelectPrimitive.Viewport className="h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1">
                                                <SelectPrimitive.Item
                                                  value="0"
                                                  className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
                                                >
                                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    <SelectPrimitive.ItemIndicator>
                                                      <Check className="h-4 w-4" />
                                                    </SelectPrimitive.ItemIndicator>
                                                  </span>
                                                  <SelectPrimitive.ItemText>
                                                    Today
                                                  </SelectPrimitive.ItemText>
                                                </SelectPrimitive.Item>
                                                <SelectPrimitive.Item
                                                  value="1"
                                                  className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
                                                >
                                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    <SelectPrimitive.ItemIndicator>
                                                      <Check className="h-4 w-4" />
                                                    </SelectPrimitive.ItemIndicator>
                                                  </span>
                                                  <SelectPrimitive.ItemText>
                                                    Tomorrow
                                                  </SelectPrimitive.ItemText>
                                                </SelectPrimitive.Item>
                                                <SelectPrimitive.Item
                                                  value="3"
                                                  className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
                                                >
                                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    <SelectPrimitive.ItemIndicator>
                                                      <Check className="h-4 w-4" />
                                                    </SelectPrimitive.ItemIndicator>
                                                  </span>
                                                  <SelectPrimitive.ItemText>
                                                    In 3 days
                                                  </SelectPrimitive.ItemText>
                                                </SelectPrimitive.Item>
                                                <SelectPrimitive.Item
                                                  value="7"
                                                  className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none"
                                                >
                                                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    <SelectPrimitive.ItemIndicator>
                                                      <Check className="h-4 w-4" />
                                                    </SelectPrimitive.ItemIndicator>
                                                  </span>
                                                  <SelectPrimitive.ItemText>
                                                    Next week
                                                  </SelectPrimitive.ItemText>
                                                </SelectPrimitive.Item>
                                              </SelectPrimitive.Viewport>
                                            </SelectPrimitive.Content>
                                          </SelectPrimitive.Portal>
                                        </SelectPrimitive.Root>
                                        <div className="rounded-md border">
                                          <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={() => {
                                              setIsCalendarPopoverOpen(false);
                                            }}
                                            onDayClick={field.onChange}
                                          />
                                        </div>
                                      </PopoverPrimitive.Content>
                                    </PopoverPrimitive.Portal>
                                  </PopoverPrimitive.Root>
                                </FormControl>
                                <FormErrorMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Button type="submit" isLoading={false}>
                              Update
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              </DialogPrimitive.Root>
              <DropdownMenuPrimitive.Item
                className="focus:bg-accent text-destructive relative flex w-full cursor-default select-none flex-row items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                asChild
              >
                <button type="button" onClick={handleDelete}>
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </button>
              </DropdownMenuPrimitive.Item>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>
    </div>
  );
}
