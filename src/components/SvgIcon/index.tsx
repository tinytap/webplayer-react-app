import { useDynamicSvgImport } from '../../hooks/useDynamicSvgImport'

interface IProps {
  iconName: string
  wrapperStyle?: string
  svgProp?: React.SVGProps<SVGSVGElement>
}

function SvgIcon(props: IProps) {
  const { iconName, wrapperStyle, svgProp } = props
  const { loading, SvgIcon } = useDynamicSvgImport(iconName)

  return (
    <>
      {SvgIcon && (
        <div className={wrapperStyle}>
          <SvgIcon {...svgProp} />
        </div>
      )}
    </>
  )
}

export default SvgIcon

