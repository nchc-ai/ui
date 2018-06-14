package validate

type Validate interface {
	Validate(string) (bool, error)
}
