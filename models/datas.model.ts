export interface Task {
   title: string,
   description: string,
   date: string,
   priority: string
   category: Category | undefined
}

export interface Category {
   title: string
}