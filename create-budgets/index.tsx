'use client'

import { Button } from '@/components/ui/button'
import { ViewNumber } from '@/components/view-number'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Plus } from 'lucide-react'
import * as React from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { BudgetForm } from '../budgets-form'
import { BudgetItemsList } from './budget-items-list'

const createBudgetsFormSchema = z.object({
  clientId: z
    .string({ required_error: 'Cliente obrigatório' })
    .min(1, { message: 'Cliente obrigatório' }),
  budgetsDate: z.date({ required_error: 'Data obrigatória' }),
  budgetItems: z.array(
    z.object({
      quantity: z.coerce.number(),
      description: z.string(),
      brand: z.string(),
      price: z.preprocess(
        value => {
          const cleanedValue = String(value).replace(',', '.')
          return Number.parseFloat(cleanedValue)
        },
        z.number().min(1, { message: 'O valor deve ser no mínimo R$ 1,00' })
      ),
      totalPrice: z.preprocess(
        value => {
          const cleanedValue = String(value).replace(',', '.')
          const parsed = Number.parseFloat(cleanedValue)
          return Number.isNaN(parsed) ? 0 : parsed
        },
        z.number().min(1, { message: 'O valor deve ser no mínimo R$ 1,00' })
      ),
    })
  ),
  totalPieces: z.coerce.number(),
  grandPrice: z.coerce.number(),
})

export type CreateBudgetsFormSchema = z.infer<typeof createBudgetsFormSchema>

export function CreateTaskSheet() {
  const [isPending, startTransition] = React.useTransition()

  // React.useEffect(() => {
  //   fetch('/api/budget-number', { method: 'POST' })
  // }, [])

  const form = useForm<CreateBudgetsFormSchema>({
    resolver: zodResolver(
      createBudgetsFormSchema
    ) as Resolver<CreateBudgetsFormSchema>,
    defaultValues: {
      clientId: '',
      budgetItems: [
        {
          quantity: 0,
          description: '',
          brand: '',
          price: 0,
          totalPrice: 0,
        },
      ],
      grandPrice: 0,
      totalPieces: 0,
    },
  })

  function onSubmit(input: CreateBudgetsFormSchema) {
    startTransition(async () => {
      console.log(input)
      // const { error } = await createTask(input)

      // if (error) {
      //   toast.error(error)
      //   return
      // }

      form.reset()
      toast.success('Task created')
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 rounded-lg border p-6">
      <ViewNumber title="Orçamento" endpoint="/api/budget-number" />
      <BudgetForm form={form} onSubmit={onSubmit}>
        <BudgetItemsList form={form} />

        <div className="grid flex-1 grid-cols-2 gap-3">
          <Button type="button" variant="destructive">
            Cancel
          </Button>

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <Loader className="animate-spin" />}
            Create
          </Button>
        </div>
      </BudgetForm>
    </div>
  )
}
