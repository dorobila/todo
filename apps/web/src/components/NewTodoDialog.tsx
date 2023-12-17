import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Check, ChevronDown, Plus, X } from 'lucide-react';
import { todoSchema } from '../lib/validations/todo';
import { zodResolver } from '@hookform/resolvers/zod';
import Calendar from './ui/Calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormErrorMessage } from './ui/Form';
import { cn } from '../lib/utils';
import { addDays, format, isBefore, startOfDay } from 'date-fns';
import { Button } from './ui/Button';
import { useState } from 'react';
import { Todo, useAddTodoMutation } from '../app/services';

export default function NewTodoDialog() {
  const [addTodo, { isLoading }] = useAddTodoMutation();

  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof todoSchema>) => {
    const valuesToSubmit: Pick<Todo, 'title' | 'description' | 'dueDate' | 'ordinal' | 'status'> = {
      ...values,
      ordinal: 0,
      status: 'pending',
    };
    addTodo(valuesToSubmit).then(() => {
      setOpen(false);
      form.reset();
    });
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus size={14} className="mr-2 h-4 w-4" />
          Add a new todo
        </button>
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
                        <PopoverPrimitive.Root>
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
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                                  <SelectPrimitive.Value placeholder="Select" />
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
                                        <SelectPrimitive.ItemText>Today</SelectPrimitive.ItemText>
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
                  <Button type="submit" isLoading={isLoading}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
