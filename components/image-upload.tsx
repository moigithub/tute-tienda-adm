import { ImagePlus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

export const ImageUpload = ({ disabled, onChange, onRemove, value }: ImageUploadProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!mounted) {
    return null
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map(url => (
          <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
            <div className='z-10 absolute top-2 right-2'>
              <Button type='button' onClick={() => onRemove(url)} variant='destructive'>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image fill className='object-cover' alt='image' src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset='ml_default'>
        {({ open }) => {
          function handleOnClick() {
            open()
          }
          return (
            <Button type='button' disabled={disabled} variant='secondary' onClick={handleOnClick}>
              <ImagePlus className='h-4 w-4 mr-2' />
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
