# More info at https://github.com/guard/guard#readme



guard 'coffeescript', input: 'src/client', output: 'public/js/lib'
guard 'coffeescript', input: 'src/server', output: 'lib'

guard 'less', all_on_start: true, all_after_change: true, output: 'public/css' do
  watch(%r{^less/.+\.less$})
end
