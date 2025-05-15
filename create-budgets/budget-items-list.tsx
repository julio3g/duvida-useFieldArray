'use client'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import * as React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import type { CreateBudgetsFormSchema } from '.'

interface BudgetItemsProps {
  form: UseFormReturn<CreateBudgetsFormSchema>
}

export function BudgetItemsList({ form }: BudgetItemsProps) {
  const {
    control,
    watch,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    name: 'budgetItems',
    control,
  })

  const budgetItems = watch('budgetItems') || []

  const totalItems = budgetItems.reduce(
    (acc, product) => acc + (product.quantity || 0),
    0
  )
  const grandTotal = budgetItems.reduce(
    (acc, product) => acc + (product.quantity * Number(product.price) || 0),
    0
  )

  setValue('totalPieces', totalItems)
  setValue('grandPrice', grandTotal)

  const namesBudgetItems = [
    {
      value: 'caveste',
      label: 'Caveste',
    },
    {
      value: 'total-sports',
      label: 'Total Sports',
    },
  ]

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex w-full gap-3">
          <div className="flex flex-col gap-2">
            <FormLabel htmlFor="quantity">Quant.:</FormLabel>
            <Input
              type="number"
              id="quantity"
              className="w-14 appearance-none text-center [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              {...register(`budgetItems.${index}.quantity`, {
                valueAsNumber: true,
                onChange: e => {
                  const quantity = Number(e.target.value) || 0
                  const price = getValues(`budgetItems.${index}.price`) || 0
                  const cleanedValue = String(price).replace(',', '.')
                  const parsedPrice = Number.parseFloat(cleanedValue)
                  setValue(
                    `budgetItems.${index}.totalPrice`,
                    quantity * parsedPrice,
                    { shouldValidate: true }
                  )
                },
              })}
            />
          </div>
          <FormField
            control={form.control}
            name={`budgetItems.${index}.description`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Descrição:</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`budgetItems.${index}.brand`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {namesBudgetItems.map(value => (
                      <SelectItem key={value.value} value={value.value}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`budgetItems.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor:</FormLabel>
                <Input
                  type="currency"
                  {...field}
                  className="w-20"
                  value={field.value}
                  onChange={e => {
                    const cleanedValue = e.target.value.replace(',', '.')
                    const parsedPrice = Number.parseFloat(cleanedValue)
                    setValue(`budgetItems.${index}.price`, parsedPrice, {
                      shouldValidate: true,
                    })
                    const quantity =
                      getValues(`budgetItems.${index}.quantity`) || 0
                    setValue(
                      `budgetItems.${index}.totalPrice`,
                      quantity * parsedPrice,
                      { shouldValidate: true }
                    )
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`budgetItems.${index}.totalPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total:</FormLabel>
                <Input
                  type="currency"
                  {...field}
                  value={field.value}
                  disabled
                  className="w-20"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            disabled={fields.length === 1}
            onClick={() => remove(index)}
            className="size-9 self-end"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        className="w-full cursor-pointer"
        onClick={() =>
          append({
            quantity: 0,
            description: '',
            brand: '',
            price: 0,
            totalPrice: 0,
          })
        }
      >
        Adicionar
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex w-full justify-between">
          <span>Total de itens: </span>
          <span>{totalItems}</span>
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 bg-accent data-[orientation=vertical]:h-4"
        />
        <div className="flex w-full justify-between">
          <span>Valor total: </span>
          <span>
            {grandTotal.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
