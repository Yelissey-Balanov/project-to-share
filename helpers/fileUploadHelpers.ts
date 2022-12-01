import { GetDocumentTagsQuery, Maybe } from '~/graphql/GQLTypes'

// interfaces for uploads
export interface IFormDocument {
  itemIndex: string
  id: Maybe<number>
  title: string
  mime_type: string
  tags: GetDocumentTagsQuery['documentTags']
  file?: File
}

export class DocumentsForm {
  documents: IFormDocument[] = []
  incrementalIndex = 0
  deletedDocumentIds: number[] = []

  add(document: Omit<IFormDocument, 'itemIndex'>) {
    this.documents.push({
      itemIndex: 'df' + this.incrementalIndex++,
      ...document,
    })
  }

  processSelectedDocuments(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.add({
        title: files[i].name.substr(0, files[i].name.lastIndexOf('.')),
        id: null,
        mime_type: files[i].type,
        tags: [],
        file: files[i],
      })
    }
  }

  deleteDocument(formDocument: IFormDocument, index: number) {
    this.documents.splice(index, 1)
    if (formDocument.id) {
      this.deletedDocumentIds.push(formDocument.id)
    }
  }

  generateMutationInput() {
    const documentMutationInput: {
      create: Array<{
        file: File
        title: string
        tags: {
          sync: number[]
        }
      }>
      update: Array<{
        id: number
        title: string
        tags: {
          sync: number[]
        }
      }>
      delete: number[]
    } = {
      create: [],
      update: [],
      delete: this.deletedDocumentIds,
    }

    this.documents.forEach((document) => {
      if (!document.id) {
        // create document
        documentMutationInput.create.push({
          file: document.file!,
          title: document.title,
          tags: {
            sync: document.tags.map((tag) => tag.id),
          },
        })
      } else {
        // update document
        documentMutationInput.update.push({
          id: document.id,
          title: document.title,
          tags: {
            sync: document.tags.map((tag) => tag.id),
          },
        })
      }
    })

    return documentMutationInput
  }
}
