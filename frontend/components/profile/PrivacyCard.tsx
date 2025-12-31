'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { apiWithAuth } from '@/lib/api'
import { logout } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { Button } from '../ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const PrivacyCard = () => {
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    password: '',
    verification: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">Privacy & Security</h2>
      <div className="mb-5">
        {success && (
          <p className="text-green-500 bg-green-500/20 border border-green-500 rounded-2xl p-4">
            {success}
          </p>
        )}
      </div>
      <ChangePasswordCard
        {...{
          setSuccess,
          formData,
          handleChange,
        }}
      />
      <DeleteAccountCard {...{ setSuccess, formData, handleChange }} />
    </>
  )
}

export default PrivacyCard

const ChangePasswordCard = ({ setSuccess, formData, handleChange }: any) => {
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setSuccess('')

    const isValid = PASSWORD_REGEX.test(formData.newPassword)

    if (!isValid) {
      setPasswordError(
        'Password must include uppercase, lowercase, number, special char (min 8 chars)'
      )
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      await apiWithAuth.post('/api/auth/users/set_password/', {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      })
      setSuccess('Password changed successfully')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as any

        const message =
          data?.detail ||
          data?.current_password?.[0] ||
          data?.new_password?.[0] ||
          data?.non_field_errors?.[0] ||
          'Failed to change password'

        setPasswordError(message)
      } else {
        setPasswordError('Unexpected error occurred')
      }
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl px-6 mb-4 bg-foreground/10 dark:bg-accent-foreground/20"
    >
      <AccordionItem value="item-1 ">
        <AccordionTrigger className="flex items-center text-lg font-semibold cursor-pointer">
          Change Password
        </AccordionTrigger>
        <AccordionContent>
          <form
            onSubmit={changePassword}
            className="w-full pt-4 flex flex-col gap-4"
          >
            {passwordError && (
              <p className="text-destructive bg-destructive/20 border border-destructive rounded-2xl p-4">
                {passwordError}
              </p>
            )}
            <div>
              <label className="font-medium mb-2">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="block outline-none w-full bg-card rounded-lg px-2 py-2 mt-1 border focus:border-ring"
              />
            </div>

            <div>
              <label className="font-medium mb-2">New Password</label>
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="block outline-none w-full bg-card rounded-lg px-2 py-2 mt-1 border focus:border-ring"
              />
            </div>

            <div>
              <label className="font-medium mb-2">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block outline-none w-full bg-card rounded-lg px-2 py-2 mt-1 border focus:border-ring"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button type="submit">Change Password</Button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DeleteAccountCard = ({ setSuccess, formData, handleChange }: any) => {
  const [passwordError, setPasswordError] = useState<string | null>('')
  const DELETE_PHRASE = 'DELETE MY ACCOUNT'
  const dispatch = useAppDispatch()

  const deleteAccount = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setSuccess('')

    try {
      await apiWithAuth.delete('/api/auth/users/me/', {
        data: {
          current_password: formData.password,
        },
      })
      setSuccess('Account deleted successfully')
      dispatch(logout())
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as any

        const message =
          data?.detail ||
          data?.current_password?.[0] ||
          data?.non_field_errors?.[0] ||
          'Failed to Delete Account'

        setPasswordError(message)
      } else {
        setPasswordError('Unexpected error occurred')
      }
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl px-6 mb-4 bg-destructive/10"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-center text-lg font-semibold text-destructive cursor-pointer">
          Delete Account
        </AccordionTrigger>
        <AccordionContent>
          <form
            onSubmit={deleteAccount}
            className="w-full pt-4 flex flex-col gap-4"
          >
            {passwordError && (
              <p className="text-destructive bg-destructive/20 border border-destructive rounded-2xl p-4">
                {passwordError}
              </p>
            )}
            <div>
              <label className="font-medium mb-2">Enter Your Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block outline-none w-full bg-card rounded-lg px-2 py-2 mt-1 border focus:border-destructive"
              />
            </div>

            <div>
              <p className="text-sm mb-2">
                To confirm, type "<strong>{DELETE_PHRASE}</strong>" below:
              </p>

              <input
                name="verification"
                type="text"
                value={formData.verification}
                onChange={handleChange}
                className="block outline-none w-full bg-card rounded-lg px-2 py-2 mt-1 border focus:border-destructive"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="destructive"
                type="submit"
                disabled={formData.verification !== DELETE_PHRASE}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Delete Account
              </Button>
            </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
